class GroupsController < ApplicationController

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
