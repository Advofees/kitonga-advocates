class ClientsController < ApplicationController

    before_action :set_client, only: [:show, :update, :destroy]

    def client_user_fields
        ["name", "username", "email", "contact_number", "address", "is_admin"]
    end

    def prefixed_client_user_fields
        client_user_fields.map { |k| "users.#{k}" }
    end

    def flat_client_fields
        ["clients.id", *prefixed_client_user_fields, "clients.created_at", "clients.updated_at"]
    end

    def search_all_clients
        begin
            render json: policy_scope(Client)
                .joins(:user)
                .where("users.username::text ILIKE ? OR users.name::text ILIKE ? OR users.email::text ILIKE ?", "%#{query_params[:q]}%", "%#{query_params[:q]}%", "%#{query_params[:q]}%")
                .select(["clients.id, users.username, users.name, users.email"].join(", "))
                .as_json

        rescue ActiveRecord::StatementInvalid => e
            render json: []
        end
    end

    def search
        if params[:response] == "count"
            begin
                render json: {
                    count: policy_scope(Client)
                    .joins(:user)
                    .where("users.#{query_params[:q]&.strip}::text ILIKE ?", "%#{query_params[:v]&.strip}%")
                    .count
                }
            rescue ActiveRecord::StatementInvalid => e
                render json: { count: 0 }
            end
        else
            begin
                render json: policy_scope(Client)
                        .joins(:user)
                        .where("users.#{query_params[:q]}::text ILIKE ?", "%#{query_params[:v]}%")
                        .order("clients.created_at DESC")
                        .select(flat_client_fields.join(", "))
                        .paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
                        .as_json

            rescue ActiveRecord::StatementInvalid => e
                render json: []
            end
        end
        
    end

    def cases_status_tally
        render json: policy_scope(Case).where(client_id: params[:id]).select("status").map(&:status).tally
    end

    def index
        if(params[:response] == "count")
            render json: { count: policy_scope(Client).count }
        else
            render json: policy_scope(Client)
                    .joins(:user)
                    .order("clients.created_at DESC")
                    .select(flat_client_fields.join(", "))
                    .paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
                    .as_json
        end
    end

    def show
        authorize @client, :show?

        render json: @client.user
    end
    
    def create
        authorize Client, :create?

        user = User.create!(client_params)
        client = Client.create!(user_id: user.id)
        render json: client
    end

    def update
        authorize @client, :update?

        @client.user.update!(update_client_params.select { |k| k.to_s != "id" })
        render json: @client, status: 200
    end

    def destroy
        authorize @client, :destroy?

        @client.destroy
        head :no_content
    end

    def destroy_multiple
        authorize Client, :destroy_multiple?

        Client.destroy(bulk_destruction_ids[:client_ids])
        head :no_content
    end
    
    private

    def bulk_destruction_ids
        params.permit(client_ids: [])
    end

    def set_client
        @client = policy_scope(Client).find(params[:id])
    end

    def update_client_params
        params.permit(:id, :name, :username, :email, :contact_number, :address)
    end

    def client_params
        params.permit(:id, :name, :username, :email, :contact_number, :address, :password, :password_confirmation)
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
