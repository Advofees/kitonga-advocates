class AccessPoliciesController < ApplicationController

    # skip_before_action :authenticate, only: [:index, :show, :search]
    before_action :set_access_policy, only: [ :show, :destroy, :update ]

    def search_resources
        klass = AccessPolicy.resources[params[:resource]]
        to_filter = params[:except] || ""
        if klass
            render json: klass.policy_columns_based_search(klass, params[:q])
        elsif params[:resource] == "all"
            render json: AccessPolicy.resources.select { |k| !to_filter.split(",").include?(k) }.map { |k, klass| klass.policy_columns_based_search(klass, params[:q]).map { |result_hash| {**result_hash, "entity" => k } } }.flatten
        else
            render json: []
        end
    end

    def count
        render json: { count: policy_scope(AccessPolicy).count }
    end

    def index
        render json: policy_scope(AccessPolicy).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
    end

    def show
        authorize @policy, :view?

        render json: @policy
    end

    def create
        authorize AccessPolicy, :create?

        render json: AccessPolicy.create!(access_policy_params)
    end

    def update
        authorize @policy, :update?

        render json: @policy.update!(access_policy_params)
    end

    def search
        render json: policy_scope(AccessPolicy).where("name ILIKE ?", "%#{params[:q]}%").select("id, name, description, created_at, updated_at, effect").as_json
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
