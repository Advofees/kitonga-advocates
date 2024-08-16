class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  self.primary_key = 'id'

  attribute :id, :uuid, default: 'gen_random_uuid()'

  def self.policy_column_names
    [ :id ]
  end

  def self.is_policy_attribute?(_attr)
    policy_column_names.map { |col| col.to_s }.include? _attr
  end

  def resource_identifiers(prefix = 'krn')
    self.class.policy_column_names.map do |column_name|
      "#{prefix}:#{self.class.name.downcase}:#{column_name}:#{self.send(column_name)}"
    end
  end
end
