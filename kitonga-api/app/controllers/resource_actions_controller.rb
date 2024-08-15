class ResourceActionsController < ApplicationController

  skip_before_action :authenticate, only: [:index, :show, :create]

  def index
    render json: ResourceAction.all
  end

  def show
    render json: ResourceAction.find(params[:id])
  end

  def create
    render json: ResourceAction.create!(resource_action_params)
  end

  def destroy
  end

  private
  
  def resource_action_params
        params.permit(:name)
  end
end
