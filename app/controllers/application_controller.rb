class ApplicationController < ActionController::Base
  before_action :configure_permited_parameters, if: :device_controller?
  protected
  def configure_permited_parameters
    device_parameter_sanitizer.permit(:sign_up, keys: [:name])
  end
end
