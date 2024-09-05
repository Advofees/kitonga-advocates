Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  resources :client_groups
  resources :client_roles
  # Defines the root path route ("/")
  root "application#welcome"
  get "jsonb", to: "application#index"
  
  scope "api" do
    scope "v1" do
      get "/current/user", to: "sessions#profile"

      get "test/search", to: "sessions#test_qs"
      
      scope "authorization" do
        resources :access_policies
        get "/access_policies/stats/count", to: "access_policies#count"
        get "search/access_policies", to: "access_policies#search"

        scope "policy_search" do
          get "users", to: "users#policy_columns_based_search"
          get "clients", to: "clients#policy_columns_based_search"
          get "roles", to: "roles#policy_columns_based_search"
          get "groups", to: "groups#policy_columns_based_search"
          get "resource_actions", to: "resource_actions#policy_columns_based_search"
          get "cases", to: "cases#policy_columns_based_search"
        end

        get "/resource_actions", to: "resource_actions#index"
        get "/resource_actions/:id", to: "resource_actions#show"
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
        get "/cases/:page_number/:page_population", to: "cases#index" #v1
        get "/cases", to: "cases#index" #v2
        get "/clients/:page_number/:page_population", to: "clients#index" #v1
        get "/clients", to: "clients#index" #v2
      end

      scope 'dashboard' do
        get "/deep/search", to: "dashboard#deep_search"
        get "/cases/per/client", to: "dashboard#cases_per_client"
        get "/counts", to: "dashboard#data_counts"
        get "/cases/first_6_most_recent_cases", to: "dashboard#first_6_most_recent_cases"
        get "/cases/tally/status", to: "dashboard#cases_status_tally"
      end

      scope "search" do
        get "/cases/:q/:v/:page_number/:page_population", to: "cases#search_cases" #v1
        get "/cases", to: "cases#search_cases" #v2
        get "/clients/:q/:v/:page_number/:page_population", to: "clients#search_clients" #v1
        get "/clients", to: "clients#search_clients" #v2
      end

      scope "filter_pages" do
        post "/cases/:criteria/:response/:page_number/:page_population", to: "cases#filter"
        post "/cases/:criteria/:response", to: "cases#filter"
      end

      scope "filter" do
        post "cases", to: "cases#filter"
        post "range/cases", to: "cases#range_filter"

        post "/cases/:criteria", to: "cases#filter"
        post "/clients/:criteria", to: "clients#filter"
        post "/filter/cases/count/:q/:v", to: "cases#filter"
        post "/range/cases/:response", to: "cases#range_filter"
        post "/range/cases/:client_id/:response/:page_number/:page_population", to: "cases#range_filter" #v1
        # post "/range/cases/:client_id/:response/:page_number/:page_population", to: "cases#range_filter" #v2
        post "/range/cases/:client_id/:response", to: "cases#range_filter"
      end

      scope "cases" do
        get "/:id", to: "cases#show"
        delete "/:id", to: "cases#destroy"
        delete "/destroy/multiple", to: "cases#destroy_multiple"
        get "/:id/payment_information", to: "cases#payment_information"
        patch "/:id/payment_information", to: "cases#update_network_payment_information"
        get "/:id/documents", to: "cases#case_documents"
        get "/:id/hearings", to: "cases#hearings"
        get "/:id/important_dates", to: "cases#important_dates"
        get "/:id/tasks", to: "cases#tasks"
        get "/:id/parties", to: "cases#parties"
        post "/new", to: "cases#create"
        patch "/:id/update", to: "cases#update"
        post "/:id/initialize_payment_information", to: "cases#create_payment_information"
        post "/:id/add_installment", to: "cases#add_installment"
        post "/:id/add_party", to: "cases#add_party"
      end

      scope "clients" do
        get "/all", to: "clients#all_clients"
        post "/new", to: "clients#create"
        patch "/:id/update", to: "clients#update"
        get "/:id/get", to: "clients#show"
        delete "/:id/delete", to: "clients#destroy"
        delete "/destroy/multiple", to: "clients#destroy_multiple"
      end

      scope "iam" do
        get "brief", to: "users#brief_users"
        resources :users
      end

      scope "parties" do
        get "/:id", to: "parties#show"
        patch "/:id", to: "parties#update"
        delete "/:id", to: "parties#destroy"
      end

      scope "payments" do
        get "/:id", to: "payments#show"
        patch "/:id", to: "payments#update"
        delete "/:id", to: "payments#destroy"
      end

      # Login
      post "/auth/access-token", to: "sessions#login"

      # Serve file attachments
      get "/media/case_document/:id/download", to: "case_documents#serve_case_document"
      get "/media/payment/:id/download", to: "payments#serve_receipt"
    end
  end
end
