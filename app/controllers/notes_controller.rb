class NotesController < ApplicationController
  def index
    @note = Note.new
    @notes = Note.includes(:user)
  end

  def create
    # binding.pry
    @note = Note.new(body: params[:note][:body], user_id: current_user.id)
    @note.save
    redirect_to root_path
  end
end
