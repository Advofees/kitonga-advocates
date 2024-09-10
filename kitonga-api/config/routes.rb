Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # resources :client_groups
  # resources :client_roles
  # Defines the root path route ("/")
  root "application#welcome"
  get "jsonb", to: "application#index"

  get "test", to: "clients#test"
  
  scope "api" do
    scope "v1" do
      get "/current/user", to: "sessions#profile"
      
      scope "authorization" do
        resources :roles
        get "/roles/stats/count", to: "roles#count"
        resources :groups
        get "/groups/stats/count", to: "groups#count"
        get "/groups/:id/users", to: "groups#show_users"
        get "/groups/:id/roles", to: "groups#show_roles"
        post "/groups/:id/roles/remove", to: "groups#remove_roles"
        post "/groups/:id/roles/add", to: "groups#add_roles"
        post "/groups/:id/users/remove", to: "groups#remove_users"
        post "/groups/:id/users/add", to: "groups#add_users"

        resources :access_policies
        get "/access_policies/stats/count", to: "access_policies#count"
        get "/search/access_policies", to: "access_policies#search"

        scope "policy_search" do
          get ":resource", to: "access_policies#search_resources"
        end

        get "/resource_actions", to: "resource_actions#index"
        get "/resource_actions/:id", to: "resource_actions#show"
        patch "/resource_actions/:id", to: "resource_actions#update"
        post "/resource_actions", to: "resource_actions#create"
        delete "/resource_actions/:id", to: "resource_actions#destroy"
        get "/resource_actions/stats/count", to: "resource_actions#count"
      end

      scope "stats" do
        get "/cases/count", to: "cases#count"
        get "/clients/count", to: "clients#count"
        get "/search/cases/count", to: "cases#search_count"
        get "/search/clients/count", to: "clients#search_count"
        get "/clients/:id/cases/status/tally", to: "clients#cases_status_tally"
      end

      scope "pages" do
        get "/cases", to: "cases#index"
        get "/clients", to: "clients#index"
      end

      scope 'dashboard' do
        get "/deep/search", to: "dashboard#deep_search"
        get "/cases/per/client", to: "dashboard#cases_per_client"
        get "/counts", to: "dashboard#data_counts"
        get "/cases/first_6_most_recent_cases", to: "dashboard#first_6_most_recent_cases"
        get "/cases/tally/status", to: "dashboard#cases_status_tally"
      end

      scope "search" do
        get "/cases", to: "cases#search_cases"
        get "/clients", to: "clients#search"
      end

      scope "filter" do
        post "cases", to: "cases#filter"
        post "range/cases", to: "cases#range_filter"
      end

      scope "cases" do
        get "/:id", to: "cases#show"
        delete "/:id", to: "cases#destroy"
        get "/:id/payment_information", to: "cases#payment_information"
        patch "/:id/payment_information", to: "cases#update_network_payment_information"
        post "/new", to: "cases#create"
        patch "/:id/update", to: "cases#update"
        post "/:id/initialize_payment_information", to: "cases#create_payment_information"
        post "/:id/add_installment", to: "cases#add_installment"
      end

      scope "iam" do
        resources :users
        resources :clients
        get "/search/users", to: "users#search"
        get "/search/clients", to: "clients#search"
        get "/search/all_clients", to: "clients#search_all_clients"
      end

      # scope "parties" do
      #   get "/:id", to: "parties#show"
      #   patch "/:id", to: "parties#update"
      #   delete "/:id", to: "parties#destroy"
      # end

      # scope "payments" do
      #   get "/:id", to: "payments#show"
      #   patch "/:id", to: "payments#update"
      #   delete "/:id", to: "payments#destroy"
      # end

      # Login
      post "/auth/access-token", to: "sessions#login"

      # Serve file attachments
      # get "/media/case_document/:id/download", to: "case_documents#serve_case_document"
      # get "/media/payment/:id/download", to: "payments#serve_receipt"
    end
  end
end
