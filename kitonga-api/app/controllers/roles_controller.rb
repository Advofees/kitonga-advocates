class RolesController < ApplicationController

    def policy_columns_based_search
        render json: Role.policy_columns_based_search(Role, params[:q])
    end

    def index
        render json: Role.all
    end

    def show
        render json: find_role
    end

    def create
    end

    def update
    end

    def destroy
    end

    private

    def find_role
        Role.find(params[:id])
    end
end
