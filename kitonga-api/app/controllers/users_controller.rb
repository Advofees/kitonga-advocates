class UsersController < ApplicationController

    before_action :set_user, only: [:show, :destroy, :update]

    def index
        render json: policy_scope(User)
    end

    def brief_users
        render json: policy_scope(User).map { |user| { username: user.username, name: user.name } }
    end

    def create
        authorize User
        render json: User.create!(user_params), status: :created
    end

    def show
        authorize @user
        render json: @user
    end

    def destroy
        authorize @user
        @user.destroy
        head :no_content
    end

    def update
        authorize @user
        @user.update!(user_params)
        render json: @user, status: :accepted
    end

    private

    def set_user
        @user = User.find(params[:id])
    end

    def user_params
        params.permit(:id, :name, :email, :username, :password, :password_confirmation, :contact_number, :address)
    end
end
