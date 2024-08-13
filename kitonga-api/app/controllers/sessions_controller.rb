class SessionsController < ApplicationController

    skip_before_action :authenticate, only: [:login]
    
    def login
        user = find_principal
        puts user
        if user&.authenticate(session_params[:password])
            # Send access token
            access_token(user, session_params[:grant_type])
        else
            if user
                raise UnauthorizedAccessException.new("Wrong password for user #{user.username}", 401)
            else
                raise UnauthorizedAccessException.new("#{session_params[:grant_type].capitalize} #{session_params[:identity]} not found", 404)
            end
        end
    end

    def access_token(usr, grant_type)
        payload = usr.as_json({ except: [:password_digest, :created_at, :updated_at] })

        # Add Grant Type
        payload[:grant_type] = grant_type
        
        if payload[:grant_type] == 'user'
            # Add roles
            payload[:roles] = usr.roles.map(&:name)

            # Add groups
            payload[:groups] = usr.groups.map(&:name)
        end

        render json: { access_token: encode_token(payload), realm: "Bearer", expires_in: 3600  }
    end

    def find_principal
        if session_params[:grant_type] == 'user'
            User.find_by("email = :identity OR username = :identity", identity: session_params[:identity])
        elsif session_params[:grant_type] == 'client'
            Client.find_by("email = :identity OR username = :identity", identity: session_params[:identity])
        else
            raise UnauthorizedAccessException.new("Invalid authentication, grant type #{session_params[:grant_type] || "NOT SPECIFIED"}", 400)
        end
    end

    private

    def session_params
        params.permit(:identity, :password, :grant_type)
    end 
end
