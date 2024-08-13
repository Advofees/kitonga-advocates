class CaseDocumentsController < ApplicationController
    def index
        render json: CaseDocument.all
    end

    def serve_case_document
        case_document = find_case_document
        if case_document.file_attachment.attached?
            redirect_to rails_blob_url(case_document.file_attachment)
        else
            render json: { message: "File Not Found" }, status: :not_found
        end
    end

    def show
    end

    def create
    end

    def update
    end

    def destroy
    end

    private

    def find_case_document
        CaseDocument.find(params[:id])
    end
end
