class DashboardController < ApplicationController

    def cases_per_client
        render json: Client.all.map { |client| { name: client.name, cases: client.cases.size }} # Case.where(client_id: client.id).count
    end

    def data_counts
        render json: {
            cases: Case.count,
            clients: Client.count,
        }
    end

    def first_10_most_recent_cases
        render json: policy_scope(Case).order("created_at DESC").limit(10)
    end

    def deep_search
        render json: { cases: deep_case_search(params[:q]), clients: deep_client_search(params[:q]) }
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
        sql = client_search_fields.map{ |f| "clients.#{f}::text ILIKE ?" }.join " OR "
        values = client_search_fields.map { "%#{q}%" }
        begin
            policy_scope(Client).where(sql, *values).paginate(page: 1, per_page: 20).map { |cs| { "entity" => "Client" ,**(cs.as_json except: ["password_digest", "updated_at", "created_at"]) } }
        rescue ActiveRecord::StatementInvalid => e
            []
        end
    end
end