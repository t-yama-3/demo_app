class NotesController < ApplicationController
  def index
    @note = Note.new
    @notes = Note.includes(:user)
  end

  def create
    @note = Note.new(note_params)
    if @note.save
      respond_to do |format|
        format.html { redirect_to root_path }
        format.json { render json: { body: @note.body, user_name: @note.user.name, user_id: @note.user_id, id: @note.id } }
      end
    end
  end

  def edit
    @note = Note.find(params[:id])
  end

  def update
    note = Note.find(params[:id])
    note.update(note_params)
    redirect_to root_path
  end

  def destroy
    @note = Note.find(params[:id])
    if @note.destroy
      respond_to do |format|
        format.html { redirect_to root_path }
        format.json { render json: { id: params[:id] } }
      end
    end
  end
  
  private
  def note_params
    params.require(:note).permit(:body).merge(user_id: current_user.id)
  end
end
