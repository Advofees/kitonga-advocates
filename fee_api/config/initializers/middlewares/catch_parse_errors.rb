class CatchParseErrors
    def initalize(app)
        @app = app
    end

    def call(env)
        begin
            @app.call(env)
        rescue ActionDispatch::Http::Parameters::ParseError => exception
            [400, { 'Content-Type' => 'application/json' }, [{ error: exception.message}.to_json]]
        end
    end
end

# Rails.application.config.middleware.insert_before(Rack::Runtime, CatchParseErrors)