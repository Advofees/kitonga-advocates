class CasesController < ApplicationController
  before_action :set_case, only: [:payment_information, :create_payment_information, :add_party, :add_installment, :update, :payment_information, :update_network_payment_information, :case_documents, :hearings, :important_dates, :tasks, :parties, :destroy, :show]

  def count
    render json: { count: policy_scope(Case).count }
  end

  def search_count
    begin
      render json: { count: policy_scope(Case).where("cases.#{query_params[:q]&.strip}::text ILIKE ?", "%#{query_params[:v]&.strip}%").count }
    rescue ActiveRecord::StatementInvalid => e
      render json: { count: 0 }
    end
  end

  def search_cases
    begin
      render json: policy_scope(Case).where("cases.#{query_params[:q]&.strip}::text ILIKE ?", "%#{query_params[:v]&.strip}%").order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
    rescue ActiveRecord::StatementInvalid => e
      render json: []
    end
  end

  def index
    render json: policy_scope(Case).order("created_at DESC").paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
  end

  def filter_helper(filtered_cases, response_columns)
    filtered_cases.map { |casex| { **(casex.payment_information ? casex.payment_information.as_json : {}), **casex.as_json, "payment_initialized" => casex.payment_initialized }.select { |k| [*response_columns, :payment_initialized].map { |r| r.to_s }.include?(k) } }
  end

  def supported_case_filter_columns
    Case.column_names
  end

  def supported_payment_information_filter_columns
    PaymentInformation.column_names
  end

  def possible_requested_response_columns
    return [] unless filter_params[:response_columns]
    case_columns = filter_params[:response_columns][:case] ? filter_params[:response_columns][:case].filter { |k| supported_case_filter_columns.include?(k) } : []
    payment_information_columns = filter_params[:response_columns][:payment_information] ? filter_params[:response_columns][:payment_information].filter { |k| supported_payment_information_filter_columns.include?(k) } : []
    [*case_columns.map { |k| "cases.#{k}" }, *payment_information_columns.map { |k| "payment_informations.#{k}" }]
  end

  def filter
    raise CustomException.new("Please specify both request and response columns", "Bad Request", 400) unless 
    filter_params[:match_columns] &&
    filter_params[:response_columns] &&
    (filter_params[:response_columns][:case] || filter_params[:response_columns][:payment_information]) &&
    (filter_params[:match_columns][:case] || filter_params[:match_columns][:payment_information])

    case_match_request_hash = filter_params[:match_columns][:case] || {}
    payment_information_match_request_hash = filter_params[:match_columns][:payment_information] || {}

    if filter_params[:criteria] == "strict"
      if filter_params[:response] == "count"
        render json: {
          count: policy_scope(Case)
                    .joins(:payment_information)
                    .where({
                      **case_match_request_hash.transform_keys {|k| "cases.#{k}"},
                      **payment_information_match_request_hash.transform_keys {|k| "payment_informations.#{k}"}
                    })
                    .count
        }
      else
        filtered_cases = policy_scope(Case)
                        .joins(:payment_information)
                        .where({
                          **case_match_request_hash.transform_keys {|k| "cases.#{k}"},
                          **payment_information_match_request_hash.transform_keys {|k| "payment_informations.#{k}"} })
                        .order("cases.created_at DESC")
                        .select([
                            "cases.id",
                            *possible_requested_response_columns
                          ]
                          .join(", ")
                        )
                        .paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
        render json: filtered_cases.as_json
      end
    else
      case_sql = ""
      sql_values = []

      or_sql_params = case_match_request_hash
      .as_json
      .map { |k, v| [k, v] }
      .reduce([[], []]) do |acc, curr|
        acc[0].push("cases.#{curr[0]}")
        acc[1].push(curr[1])
        acc
      end

      or_sql_params = payment_information_match_request_hash
      .as_json
      .map { |k, v| [k, v] }
      .reduce(or_sql_params) do |acc, curr|
        acc[0].push("payment_informations.#{curr[0]}")
        acc[1].push(curr[1])
        acc
      end

      case_sql = or_sql_params[0].map { |k| "#{k}::text ILIKE ?" }.join(" OR ")
      sql_values = or_sql_params[1].map { |p| "%#{p}%" }

      if filter_params[:response] == "count"
        render json: {
          count: policy_scope(Case)
                  .joins(:payment_information)
                  .where(
                    case_sql,
                    *sql_values
                  )
                  .count
        }
      else
        filtered_cases = policy_scope(Case)
                        .joins(:payment_information)
                        .where(
                          case_sql,
                          *sql_values
                        )
                        .order("cases.created_at DESC")
                        .select([
                            "cases.id",
                            *possible_requested_response_columns
                          ]
                          .join(", ")
                        )
                        .paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
        render json:  filtered_cases.as_json
      end
    end
  end

  def range_filter
  
    range_filter_hash = filter_params[:per_column_range_filter_params]

    if not range_filter_hash or not range_filter_hash[:parameter] or (range_filter_hash[:parameter][:case]&.to_hash.length < 1 && range_filter_hash[:parameter][:payment_information]&.to_hash.length < 1)
      render json: { error: "Unprocessable Entity" }, status: :unprocessable_entity
    else

      sql_tokens = []
      sql_values = []

      merged_ranges_hash = {
        **(range_filter_hash[:parameter][:case] ? range_filter_hash[:parameter][:case].transform_keys {|k| "cases.#{k}"} : {} ),
        **(range_filter_hash[:parameter][:payment_information] ? range_filter_hash[:parameter][:payment_information].transform_keys {|k| "payment_informations.#{k}"} : {} )
      }

      if merged_ranges_hash.length > 0
        merged_ranges_hash.map do |k, v|
          sql_token = []
          if v.length > 0
            sql_token << "#{k} >= ?"
            sql_values << v[0]
          end

          if v.length > 1
            sql_token << "#{k} < ?"
            sql_values << v[1]
          end
          sql_tokens << "(#{sql_token.join(" AND ")})" if sql_token.length > 0
        end
      end

      if filter_params[:response] == "count"
        render json: {
          count: policy_scope(Case)
                  .joins(:payment_information)
                  .where( sql_tokens.join(" AND "), *sql_values)
                  .count
        }
      else
        render json: policy_scope(Case)
                      .joins(:payment_information)
                      .where( sql_tokens.join(" AND "), *sql_values)
                      .order("cases.created_at DESC")
                      .select(possible_requested_response_columns.length > 0 ? possible_requested_response_columns.join(", ") : "cases.*")
                      .paginate(page: pagination_params[:page_number], per_page: pagination_params[:page_population])
                      .as_json
      end
    end
  end

  def show
    authorize @casex, :view?
    render json: @casex
  end

  def create
    authorize Case
    cs = Case.create!(case_params)
    render json: cs, status: :created
  end

  def add_party
    # Clone party parameters
    pars = party_params

    # Remove case id from params
    pars.delete :id

    # Create Party
    party = Party.create!({
      **pars,
      case_id: @casex.id,
    })
    render json: @casex.parties, status: :created
  end

  def add_installment
    # authorize @casex, :update?
    if @casex.payment_information
      payment_information = @casex.payment_information
      installment = Payment.create!({
        payment_method: installment_params[:payment_method],
        payment_type: installment_params[:payment_type],
        amount: installment_params[:amount],
        payment_information_id: payment_information.id,
      })

      update_payment_information(payment_information, installment.amount)

      render json: installment, status: :accepted
    else
      raise UnauthorizedAccessException.new("Payment Information not found", 404)
    end
  end

  def create_payment_information
    # authorize @casex, :update?

    if @casex.payment_information
      render json: { message: "Payment Information Exists. Consider performing an update" }, status: 409
    else
      if payment_information_params[:payment_type] == "full"
        payment_information = PaymentInformation.create!({
          case_id: @casex.id,
          payment_type: "full",
          outstanding: 0,
          paid_amount: payment_information_params[:total_fee],
          total_fee: payment_information_params[:total_fee],
        })
        render json: payment_information, status: :created
      else

        # Create payment information
        payment_information = PaymentInformation.create!({
          case_id: @casex.id,
          payment_type: "installment",
          outstanding: payment_information_params[:total_fee].to_f,
          paid_amount: 0,
          total_fee: payment_information_params[:total_fee],
        })

        if payment_information_params[:payment]
          # Extract the down payment params
          down_payment_params = payment_information_params[:payment]

          # Create first payment
          first_payment = Payment.create!({
            **down_payment_params,
            payment_information_id: payment_information.id,
          })

          update_payment_information(payment_information, first_payment.amount)
        end

        render json: payment_information
      end
    end
  end

  def update_payment_information(payment_information, amount)
    # Update payment information balance
    payment_information.paid_amount = payment_information.paid_amount + amount
    payment_information.outstanding = payment_information.total_fee - payment_information.paid_amount

    # Resave payment information
    payment_information.save
  end

  def update
    @casex.update!(update_case_params)
    render json: @casex, status: :accepted
  end

  def payment_information
    render json: @casex.payment_information
  end

  def update_network_payment_information
    pay_info = @casex.payment_information
    
    raise CustomException.new("Payment not yet initialized for this Case", 404) unless pay_info

    pay_info.update!(update_payment_information_params)
    render json: pay_info, status: :accepted
  end

  def case_documents
    render json: @casex.case_documents
  end

  def hearings
    render json: @casex.hearings
  end

  def important_dates
    render json: @casex.important_dates
  end

  def tasks
    render json: @casex.tasks
  end

  def parties
    render json: @casex.parties
  end

  def destroy
    # authorize @casex, :destroy?
    @casex.destroy
    head :no_content
  end

  def destroy_multiple

    case_ids = bulk_destruction_ids[:case_ids]

    raise CustomException.new("Please provide atleast one case id", 400) unless case_ids and !case_ids.empty?

    # Authorize all cases before bulk destruction
    case_ids.each do |case_id|
      authorize Case.find(case_id), :destroy?
    end

    Case.destroy(case_ids)
    head :no_content
  end

  private

  def update_payment_information_params
    params.permit(:total_fee, :payment_type, :outstanding, :paid_amount, :deposit_pay, :deposit_fees, :final_fees, :final_pay, :deposit)
  end

  def party_params
    params.permit(:id, :party_type, :name, :email, :contact_number, :address)
  end

  def update_case_params
    params.permit(:title, :description, :case_no_or_parties, :record, :file_reference, :clients_reference, :status)
  end

  def case_params
    params.permit(:id, :title, :description, :case_no_or_parties, :record, :file_reference, :clients_reference, :status, :client_id, case_documents: [:title, :description, :file_attachment])
  end

  def payment_information_params
    params.permit(:id, :payment_type, :total_fee, payment: [:payment_type, :payment_method, :amount])
  end

  def installment_params
    params.permit(:id, :payment_type, :payment_method, :amount)
  end

  def set_case
    @casex = Case.find(params[:id])
  end

  def find_client
    client = Client.find_by(id: params[:client_id])
    if client
      client
    else
      raise ResourceNotFoundException, "Client by id #{params[:client_id]} not found"
    end
  end

  def bulk_destruction_ids
    params.permit(case_ids: [])
  end

  def filter_params
    params.permit(
      :page_number,
      :page_population,
      :criteria,
      :response,
      per_column_range_filter_params: [
        parameter: [
          case: [
            created_at: [],
            updated_at: []
          ],
          payment_information: [
            outstanding: [],
            paid_amount: [],
            total_fee: [],
            deposit_pay: [],
            deposit_fees: [],
            final_fees: [],
            final_pay: [],
            deposit: [],
            created_at: [],
            updated_at: []
          ]
        ],
      ],
      response_columns: [
        case: [],
        payment_information: []
      ],
      match_columns: [
        case: [
          :id,
          :title,
          :description,
          :case_no_or_parties,
          :record,
          :file_reference,
          :clients_reference,
          :status,
          :client_id,
          :created_at,
          :updated_at
        ],
        payment_information: [
          :id,
          :case_id,
          :payment_type,
          :outstanding,
          :paid_amount,
          :total_fee,
          :deposit_pay,
          :deposit_fees,
          :final_fees,
          :final_pay,
          :deposit
        ]
      ]
    )
  end
end
