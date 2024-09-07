class ResourceActionsController < ApplicationController

  skip_before_action :authenticate, only: [:index, :show, :create]

  def policy_columns_based_search
    policy_columns = ResourceAction.policy_column_names.map(&:to_s)
    render json: ResourceAction.where(policy_columns.map { |col| "users.#{col}::text ILIKE ?" }.join(" OR "), *policy_columns.map { "%#{params[:q]}%" }).select(policy_columns.join(", ")).as_json
  end

  def count
    render json: { count: ResourceAction.count }
  end

  def index
    render json: ResourceAction.all.order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
  end

  def show
    render json: ResourceAction.find(params[:id])
  end

  def update
    render json: ResourceAction.find(params[:id]).update!(resource_action_params), status: :accepted
  end

  def create
    render json: ResourceAction.create!(resource_action_params), status: :created
  end

  def destroy
    ResourceAction.find(params[:id]).destroy
    head :no_content
  end

  private
  
  def resource_action_params
    params.permit(:name)
  end
end
