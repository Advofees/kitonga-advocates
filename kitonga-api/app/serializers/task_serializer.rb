class TaskSerializer < ActiveModel::Serializer
  attributes :id, :description, :due_date, :completion_status, :case_id, :user_id
end
