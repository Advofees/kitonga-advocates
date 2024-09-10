class ResourceActionsController < ApplicationController

  before_action :set_resource_action, only: [:show, :update, :destroy]

  def policy_columns_based_search
    policy_columns = ResourceAction.policy_column_names.map(&:to_s)
    render json: policy_scope(ResourceAction).where(policy_columns.map { |col| "users.#{col}::text ILIKE ?" }.join(" OR "), *policy_columns.map { "%#{params[:q]}%" }).select(policy_columns.join(", ")).as_json
  end

  def count
    render json: { count: policy_scope(ResourceAction).count }
  end

  def index
    render json: policy_scope(ResourceAction).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
  end

  def show
    authorize @resource_action, :show?

    render json: @resource_action
  end

  def update
    authorize @resource_action, :update?

    render json: @resource_action.update!(resource_action_params), status: :accepted
  end

  def create
    authorize ResourceAction, :create?

    render json: ResourceAction.create!(resource_action_params), status: :created
  end

  def destroy
    authorize @resource_action, :destroy?

    @resource_action.destroy
    head :no_content
  end

  private

  def set_resource_action
    @resource_action = policy_scope(ResourceAction).find(params[:id])
  end
  
  def resource_action_params
    params.permit(:name)
  end
end
