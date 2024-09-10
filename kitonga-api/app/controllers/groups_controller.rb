class GroupsController < ApplicationController

    before_action :set_group, only: [:show, :destroy, :remove_roles, :add_roles, :remove_users, :add_users, :show_roles, :show_users, :update]

    def count
        render json: { count: policy_scope(Group).count }
    end

    def index
        render json: policy_scope(Group).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
    end

    def create
        authorize Group, :create?

        render json: Group.create!(update_group_params), status: :created
    end

    def show
        authorize @group, :show?

        render json: @group
    end

    def show_roles
        render json: @group.roles
    end

    def show_users
        render json: @group.users
    end

    def destroy
        authorize @group, :destroy?

        @group.destroy
        head :no_content
    end

    def remove_roles

        authorize @group, :remove_roles?

        if modify_roles_users_params[:ids] && modify_roles_users_params[:ids].length > 0
            modify_roles_users_params[:ids].each do |id|
                raise ResourceNotFoundException.new("Role with id \##{id} not found in this group") if !@group.roles.map(&:id).include?(id)
            end
            orSQL = modify_roles_users_params[:ids].map { "role_id = ?" }.join(" OR ")
            RoleGroup.where("(#{orSQL}) AND group_id = ?", *modify_roles_users_params[:ids], @group.id ).destroy_all
            render json: { message: "Roles removed successfully" }
        else
            raise CustomException.new("Please include atleast one role", "UNPROCESSABLE_ENTITY", 422)
        end
    end

    def add_roles

        authorize @group, :add_roles?

        if modify_roles_users_params[:ids] && modify_roles_users_params[:ids].length > 0
            modify_roles_users_params[:ids].each do |id|
                raise ResourceNotFoundException.new("Role with id \##{id} not found") unless Role.exists?(id: id)
            end
            existing_assosiations = @group.roles.map(&:id)
            non_existing_associations = modify_roles_users_params[:ids].filter { |rl| !existing_assosiations.include?(rl) }
            RoleGroup.create!(non_existing_associations.map { |role_id| { role_id: role_id, group_id: @group.id } })
            render json: { message: "Roles added successfully" }
        else
            raise CustomException.new("Please include atleast one role", "UNPROCESSABLE_ENTITY", 422)
        end
    end

    def remove_users

        authorize @group, :remove_users?

        if modify_roles_users_params[:ids] && modify_roles_users_params[:ids].length > 0
            modify_roles_users_params[:ids].each do |id|
                raise ResourceNotFoundException.new("User with id \##{id} not found in this group") if !@group.users.map(&:id).include?(id)
            end
            orSQL = modify_roles_users_params[:ids].map { "user_id = ?" }.join(" OR ")
            UserGroup.where("(#{orSQL}) AND group_id = ?", *modify_roles_users_params[:ids], @group.id ).destroy_all
            render json: { message: "Users removed successfully" }
        else
            raise CustomException.new("Please include atleast one user", "UNPROCESSABLE_ENTITY", 422)
        end
    end

    def add_users

        authorize @group, :add_users?

        if modify_roles_users_params[:ids] && modify_roles_users_params[:ids].length > 0
            modify_roles_users_params[:ids].each do |id|
                raise ResourceNotFoundException.new("User with id \##{id} not found") unless User.exists?(id: id)
            end
            existing_assosiations = @group.users.map(&:id)
            non_existing_associations = modify_roles_users_params[:ids].filter { |rl| !existing_assosiations.include?(rl) }
            UserGroup.create!(non_existing_associations.map { |user_id| { user_id: user_id, group_id: @group.id } })
            render json: { message: "Users added successfully" }
        else
            raise CustomException.new("Please include atleast one user", "UNPROCESSABLE_ENTITY", 422)
        end
    end

    def update
        authorize @group, :update?

        @group.update!(update_group_params)
        render json: @group, status: :accepted
    end

    private

    def set_group
        @group = Group.find(params[:id])
    end

    def update_group_params
        params.permit(:name)
    end

    def modify_roles_users_params
        params.permit(:id, ids: [])
    end
end
