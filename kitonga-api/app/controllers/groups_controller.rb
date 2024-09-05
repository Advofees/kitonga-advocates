class GroupsController < ApplicationController

    def policy_columns_based_search
        render json: Group.policy_columns_based_search(Group, params[:q])
    end

    def index
        render json: Group.all
    end

    def show
        render json: find_group
    end

    def create
    end

    def update
    end

    def destroy
    end

    private

    def find_group
        Group.find(params[:id])
    end
end
