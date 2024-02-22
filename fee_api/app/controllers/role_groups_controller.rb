class RoleGroupsController < ApplicationController
    def index
        render json: RoleGroup.all
    end

    def show
        render json: find_role_group
    end

    def create
    end

    def update
    end

    def destroy
    end

    private

    def find_role_group
        RoleGroup.find(params[:id])
    end
end
