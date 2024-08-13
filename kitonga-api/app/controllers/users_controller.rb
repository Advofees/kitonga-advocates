class UsersController < ApplicationController
    def index
        render json: User.all
    end

    def brief_users
        render json: User.all.map { |user| { username: user.username, name: user.name } }
    end

    def create
        render json: User.create!(user_params), status: :created
    end

    def show
        render json: find_user
    end

    def destroy
        find_user.destroy
        head :no_content
    end

    def update
        user = find_user
        user.update!(user_params)
        pp user_params
        render json: user, status: :accepted
    end

    private

    def find_user
        User.find(params[:id])
    end

    def user_params
        params.permit(:id, :name, :email, :username, :password, :password_confirmation, :contact_number, :address)
    end
end
