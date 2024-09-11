class RolesController < ApplicationController

    before_action :set_role, only: [:show, :destroy, :update]

    def count
        render json: { count: policy_scope(Role).count }
    end

    def index
        render json: policy_scope(Role).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
    end

    def create
        authorize Role, :create?

        render json: Role.create!(update_role_params), status: :created
    end

    def show
        authorize @role, :show?

        render json: @role
    end

    def destroy
        authorize @role, :destroy?

        @role.destroy
        head :no_content
    end

    def update
        authorize @role, :update?

        @role.update!(update_role_params)
        render json: @role, status: :accepted
    end

    private

    def set_role
        @role = Role.find(params[:id])
    end

    def update_role_params
        params.permit(:name, :description)
    end
end
