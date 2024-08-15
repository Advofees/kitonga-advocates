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
      
      scope "authorization" do
        get "/access/policies", to: "policies#index"
        get "/access/policies/:id", to: "policies#show"
        post "/access/policies", to: "policies#create"
        get "/resource/actions", to: "resource_actions#index"
        get "/resource/actions/:id", to: "resource_actions#show"
        post "/resource/actions", to: "resource_actions#create"
      end

      scope "stats" do
        get "/cases/count", to: "cases#count"
        get "/clients/count", to: "clients#count"
        get "/search/cases/count/:q/:v", to: "cases#search_count"
        get "/search/clients/count/:q/:v", to: "clients#search_count"
        get "/clients/:id/cases/status/tally", to: "clients#cases_status_tally"
      end

      scope "pages" do
        get "/cases/:page_number/:page_population", to: "cases#index"
        get "/clients/:page_number/:page_population", to: "clients#index"
      end

      scope 'dashboard' do
        get "/deep/search/:q", to: "dashboard#deep_search"
        get "/cases/per/client", to: "dashboard#cases_per_client"
        get "/counts", to: "dashboard#data_counts"
        get "/cases/first_10_most_recent_cases", to: "dashboard#first_10_most_recent_cases"
      end

      scope "search" do
        get "/cases/:q/:v/:page_number/:page_population", to: "cases#search_cases"
        get "/clients/:q/:v/:page_number/:page_population", to: "clients#search_clients"
      end

      scope "filter_pages" do
        post "/cases/:criteria/:response/:page_number/:page_population", to: "cases#filter"
        post "/cases/:criteria/:response", to: "cases#filter"
      end

      scope "filter" do
        post "/cases/:criteria", to: "cases#filter"
        post "/clients/:criteria", to: "clients#filter"
        post "/filter/cases/count/:q/:v", to: "cases#filter"
        post "/range/cases/:response", to: "cases#range_filter"
        post "/range/cases/:client_id/:response/:page_number/:page_population", to: "cases#range_filter"
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

      scope "users" do
        get "/brief", to: "users#brief_users"
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
