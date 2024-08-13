class PartiesController < ApplicationController
    def show
        render json: find_party
    end

    def update
        party = find_party
        party.update!(party_params)
        render json: party, status: :accepted
    end

    def destroy
        party = find_party
        party.destroy
        head :no_content
    end

    private

    def find_party
        Party.find(params[:id])
    end

    def party_params
        params.permit(:id, :party_type, :name, :email, :contact_number, :address)
    end
end
