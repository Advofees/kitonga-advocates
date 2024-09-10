class UsersController < ApplicationController

    before_action :set_user, only: [:show, :destroy, :update]

    def index
        if(params[:response] == "count")
            render json: { count: policy_scope(User).count }
        else
            render json: policy_scope(User).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
        end
    end

    def search
        begin
            if(params[:response] == "count")
                render json: { count: policy_scope(User).where("users.#{query_params[:q]&.strip}::text ILIKE ?", "%#{query_params[:v]&.strip}%").count }
            else
                render json: policy_scope(User).where("users.#{query_params[:q]&.strip}::text ILIKE ?", "%#{query_params[:v]&.strip}%").order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
            end
        rescue ActiveRecord::StatementInvalid => e
            render json: params[:response] == "count" ? { count: 0 } : []
        end
    end

    def create
        authorize User, :create?

        render json: User.create!(create_user_params), status: :created
    end

    def show
        authorize @user, :show?

        render json: @user
    end

    def destroy
        authorize @user, :destroy?

        @user.destroy
        head :no_content
    end

    def update
        authorize @user, :update?

        @user.update!(update_user_params)
        render json: @user, status: :accepted
    end

    private

    def set_user
        @user = policy_scope(User).find(params[:id])
    end

    def create_user_params
        params.permit(:id, :name, :email, :username, :password, :password_confirmation, :contact_number, :address)
    end

    def update_user_params
        params.permit(:name, :email, :username, :contact_number, :address)
    end
end
