class AccessPoliciesController < ApplicationController

    skip_before_action :authenticate, only: [:index, :show, :search]
    before_action :set_access_policy, only: [ :show, :destroy, :update ]

    def index
        render json: policy_scope(AccessPolicy)
    end

    def show
        authorize @policy, :view?
        render json: @policy
    end

    def create
        authorize AccessPolicy
        render json: AccessPolicy.create!(access_policy_params)
    end

    def update
        authorize @policy, :update?
        render json: @policy.update!(access_policy_params)
    end

    def search
        render json: policy_scope(AccessPolicy).where("name ILIKE ?", "%#{params[:q]}%")
    end

    def destroy
        authorize @policy, :destroy?
        @policy.destroy
        head :no_content
    end

    private

    def set_access_policy
        @policy = AccessPolicy.find(params[:id])
    end

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
