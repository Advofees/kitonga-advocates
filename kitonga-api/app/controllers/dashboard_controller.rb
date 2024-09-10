class DashboardController < ApplicationController

    def cases_status_tally
        render json: policy_scope(Case).all.select("status").map(&:status).tally
    end

    def cases_per_client
        render json: Client.all.map { |client| { name: client.user.name, cases: client.cases.size }} # Case.where(client_id: client.id).count
    end

    def data_counts
        render json: {
            cases: policy_scope(Case).count,
            clients: Client.count,
            users: User.count
        }
    end

    def first_6_most_recent_cases
        render json: policy_scope(Case).order("created_at DESC").select("id, title, status, created_at, record").limit(6).as_json
    end

    def deep_search
        if params[:q]
            render json: { cases: deep_case_search(params[:q]), clients: deep_client_search(params[:q]) }
        else
            render json: {cases: [], clients: []} 
        end
    end

    def deep_case_search(q)
        case_searchable_fields = ["title", "description", "case_no_or_parties", "record", "file_reference", "clients_reference"]
        sql = case_searchable_fields.map{ |f| "cases.#{f}::text ILIKE ?" }.join " OR "
        values = case_searchable_fields.map { "%#{q}%" }
        begin
            policy_scope(Case).where(sql, *values).paginate(page: 1, per_page: 20).map { |cs| { "entity" => "Case" ,**(cs.as_json except: ["client_id", "updated_at", "created_at", "status"]) } }
        rescue ActiveRecord::StatementInvalid => e
            []
        end
    end

    def deep_client_search(q)
        client_search_fields = ["name", "username", "email", "address", "contact_number"]
        sql = client_search_fields.map{ |f| "users.#{f}::text ILIKE ?" }.join " OR "
        values = client_search_fields.map { "%#{q}%" }
        begin
            prefixed_client_search_fields = ["clients.id", *client_search_fields.map { |k| "users.#{k}" } ].join(", ")
            policy_scope(Client).joins(:user).where(sql, *values).select(prefixed_client_search_fields).paginate(page: 1, per_page: 20).as_json.map { |cs| { "entity" => "Client" , **cs } }
        rescue ActiveRecord::StatementInvalid => e
            []
        end
    end
end