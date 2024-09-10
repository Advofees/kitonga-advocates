class SessionsController < ApplicationController

    skip_before_action :authenticate, only: [:login]
    
    def login
        user = find_principal
        if user&.authenticate(session_params[:password])
            # Send access token
            access_token(user)
        else
            if user
                raise UnauthorizedAccessException.new("Wrong password for user #{user.username}", 401)
            else
                raise UnauthorizedAccessException.new("User '#{session_params[:identity]}' not found", 404)
            end
        end
    end
    
    def profile
        render json: pundit_user.as_json(except: ["resource_identifiers"]), status: :ok
    end

    def access_token(usr)
        payload = usr.as_json({ except: [:password_digest, :created_at, :updated_at] })
        
        # Add roles
        payload[:roles] = usr.roles.map(&:name)

        # Add groups
        payload[:groups] = usr.groups.map(&:name)

        token = encode_token(payload)

        cookies.signed[:user] = { value: token, httponly: true, expires: 1.hour }

        render json: { access_token: token, realm: "Bearer", expires_in: 3600  }
    end

    def find_principal
        User.find_by("email = :identity OR username = :identity", identity: session_params[:identity])
    end

    private

    def session_params
        params.permit(:identity, :password)
    end
end
