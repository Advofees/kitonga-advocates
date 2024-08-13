class LocationsController < ApplicationController

    before_action :authenticate_user!

    def index
        render json: Location.all
    end

    def show
        render json: find_location
    end

    def create
    end

    def update
    end

    def destroy
    end

    private

    def find_location
        Location.find(params[:id])
    end
end
