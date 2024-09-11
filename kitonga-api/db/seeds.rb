# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end


require 'faker'
require_relative 'seed.data'

# Create client role
puts "Create client role"
client_role = Role.create!({
  name: "CLIENT",
  description: "Clients"
})

# puts "Creating Clients and their cases"
# SeedData.clients.slice(0, 6).each do |clnt|

#   p_client = {**clnt.select { |k| ["name", "username", "email", "contact_number", "address"].include?(k.to_s) }, password: "password"}

#   user_client = User.create!(p_client)

#   client = Client.create!(user_id: user_client.id)
#   client_cases = SeedData.cases.filter { |f| f["user_id"] == clnt[:id] && !f["clients_reference"].strip.empty? && !f["file_reference"].strip.empty? && f["record"] && !f["case_no_or_parties"].strip.empty? }.slice(0, 20)

#   puts "Seeding #{user_client.name}'s cases"
#   client_cases.each do |casex|

#     client_case = Case.create!({
#       title: Faker::Lorem.sentence,
#       description: Faker::Lorem.paragraph(sentence_count: 4),
#       case_no_or_parties: casex["case_no_or_parties"],
#       record: casex["record"],
#       file_reference: casex["file_reference"],
#       clients_reference: casex["clients_reference"],
#       status: SeedData.case_states.sample,
#       client_id: client.id,
#     })

#     payment_information = PaymentInformation.create!(
#       case_id: client_case.id,
#       payment_type: ["full", "installment"].sample,
#       outstanding: casex["outstanding"],
#       paid_amount: (casex["final_fees"] - casex["outstanding"]),
#       total_fee: casex["final_fees"],

#       deposit_pay: casex["deposit_pay"], 
#       deposit_fees: casex["deposit_fees"], 
#       final_fees: casex["final_fees"], 
#       final_pay: casex["final_pay"], 
#       deposit: casex["deposit"]
#     )

#     puts "#{user_client.name} ------> #{client_case.id}"
#   end
# end

puts "Creating Actions"
SeedData.actions.each do |action|
  ResourceAction.create(name: action)
end

puts "Creating Superuser"
admin = User.create!({
    username: 'admin',
    name: 'admin admin',
    email: 'admin@gmail.com',
    contact_number: '555-444-3333',
    address: '789 Oak Rd',
    password: 'password'
})

# Create admin role
puts "Create admin role"
admin_role = Role.create!({
  name: "ADMIN",
  description: "Administrator"
})

# Assign ADMIN Privileges to above admin
puts "Assign ADMIN Privileges to #{admin.email}"
UserRole.create!({
  user_id: admin.id,
  role_id: admin_role.id
})