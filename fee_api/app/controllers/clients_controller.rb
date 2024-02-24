class ClientsController < ApplicationController

    def count
        render json: { count: Client.count }
    end

    def search_count
        begin
            render json: { count: policy_scope(Client).where("clients.#{params[:q]}::text ILIKE ?", "%#{params[:v].strip}%").count }
        rescue ActiveRecord::StatementInvalid => e
            render json: { count: 0 }
        end
    end

    def search_clients
        begin
            render json: policy_scope(Client).where("clients.#{params[:q]}::text ILIKE ?", "%#{params[:v]}%").order("created_at DESC").paginate(page: params[:page_number], per_page: params[:page_population])
        rescue ActiveRecord::StatementInvalid => e
            render json: []
        end
    end

    def filter
        if filter_params[:criteria] == "strict"
            render json: policy_scope(Client).where(filter_params[:match_columns]).order("created_at DESC")
        else
            if filter_params[:match_columns]&.keys.length > 0
                client_tokens = filter_params[:match_columns].keys.reduce([]) do |acc, curr|
                    acc.push("clients.#{curr}::text ILIKE ?")
                    acc
                end
            
                render json: policy_scope(Client).where("#{client_tokens.join(" OR ")}", *filter_params[:match_columns]&.values.map { |v| "%#{v}%" } ).order("created_at DESC").map { |v| v.as_json.select { |k| filter_params[:response_columns].map { |r| r.to_s }.include?(k) } }
            else
                render json: []
            end
        end
    end

    def cases_status_tally
        render json: find_client.cases.map(&:status).tally
    end

    def all_clients
        render json: Client.select(["name", "id"]).map {|c| {id: c.id, name: c.name }}
    end

    def index
        render json: Client.all.order("created_at DESC").paginate(page: params[:page_number], per_page: params[:page_population])
    end

    def show
        client = find_client
        authorize client, :view?
        render json: find_client
    end
    
    def create
        render json: Client.create!(client_params)
    end

    def update
        client = find_client
        client.update!(client_params)
        render json: client, status: 200
    end

    def destroy
        client = find_client
        client.destroy
        head :no_content
    end

    def destroy_multiple
        Client.destroy(bulk_destruction_ids[:client_ids])
        head :no_content
    end
    
    private

    # def client_params
    #     # params.permit(client_data: [:name, :email, :contact_number, :address, :case_details, :is_prime ], payment_data: [:amount, :method, :payment_type, :receipt ], case_data: [:title, :description, :case_number, :payment_type, :deposit_fee, :total_amount, :status, attached_documents: [:title, :description, :dataUrl, :mime]])
    #     params.permit(:name, :username, :email, :contact_number, :address)
    # end

    def bulk_destruction_ids
        params.permit(client_ids: [])
    end

    def find_client
        policy_scope(Client).find(params[:id])
    end

    def client_params
        params.permit(:id, :name, :username, :email, :contact_number, :address, :password, :password_confirmation)
    end

    def filter_params
        params.permit(
            :criteria,
            response_columns: [],
            match_columns: [ :id, :name, :username, :email, :contact_number, :address ]
        )
    end
end



# begin
#     # Create a new client
#     client = Client.create!({**client_params[:client_data], user_id: @user&.id })

#     if @user
#         user_client = UserClient.create!(client_id: client.id, user_id: @user.id)
#     end

#     # Associate the client with a case
#     case_params = client_params[:case_data]
#     new_case = Case.create!({
#         title: case_params[:title],
#         description: case_params[:description],
#         case_number: case_params[:case_number],
#         payment_type: case_params[:payment_type],
#         deposit_fee: case_params[:deposit_fee],
#         total_amount: case_params[:total_amount],
#         status: case_params[:status],
#         client_id: client.id
#     })

#     # Save attached documents to active strorage
#     case_documents = case_params[:attached_documents]
#     if case_documents&.length > 0
#         case_documents.each do |case_document_params|
#             case_document = CaseDocument.create!({
#                 title: case_document_params[:title],
#                 description: case_document_params[:description],
#                 case_id: new_case.id
#             })
#             case_document_data_url = case_document_params[:dataUrl]
#             save_binary_data_to_active_storage(case_document.file_attachment, case_document_data_url, case_document.title)
#         end
#     end

#     # Save deposit/full/installment payments
#     payment_params = client_params[:payment_data]
#     new_payment = Payment.create!({
#         amount: payment_params[:amount],
#         payment_method: payment_params[:method],
#         payment_type: payment_params[:payment_type],
#         client_id: client.id,
#         user_id: @user&.id,
#         case_id: new_case.id
#     })

#     # Attach receipt
#     receipt_data_url = payment_params[:receipt]
#     if receipt_data_url
#         save_binary_data_to_active_storage(new_payment.receipt, receipt_data_url, new_case.title)
#     end

#     render json: client, status: :created
#     rescue StandardError => e
#     render json: { error: "#{e.message}" } , status: :unprocessable_entity
# end
