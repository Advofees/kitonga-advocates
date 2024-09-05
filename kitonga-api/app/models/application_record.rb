class ApplicationRecord < ActiveRecord::Base
  primary_abstract_class

  self.primary_key = 'id'

  attribute :id, :uuid, default: 'gen_random_uuid()'

  def self.policy_columns_based_search(klass, q)
    policy_columns = klass.policy_column_names.map(&:to_s)
    klass.where(policy_columns.map { |col| "#{klass.table_name}.#{col}::text ILIKE ?" }.join(" OR "), *policy_columns.map { "%#{q}%" }).select(policy_columns.join(", ")).as_json
  end

  def self.policy_column_names
    [ :id ]
  end

  def self.test
    self.class
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
