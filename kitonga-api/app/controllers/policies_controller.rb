class PoliciesController < ApplicationController

    skip_before_action :authenticate, only: [:index, :show, :create]

    def index
        render json: AccessPolicy.all
    end

    def show
        render json: AccessPolicy.find(params[:id])
    end

    def create
        render json: AccessPolicy.create!(access_policy_params)
    end

    private

    def access_policy_params
        params.permit(
            :name,
            :description,
            :effect,
            actions: [],
            principals: [],
            resources: []
        )
    end
end
