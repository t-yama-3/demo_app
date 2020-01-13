class NotesController < ApplicationController
  def index
    @note = Note.new
    @notes = Note.includes(:user)
  end

  def create
    # 本当はストロングパラメーターにすべきですがサンプルなので簡易作成
    @note = Note.new(body: params[:note][:body], user_id: current_user.id)
    if @note.save
      respond_to do |format|
        format.html {
          redirect_to root_path
        }
        format.json {
          render json: {
            body: @note.body,
            user_name: @note.user.name,
            user_id: @note.user_id,
            id: @note.id
          }
        }
      end
    end
  end

  def destroy
    note = Note.find(params[:id])
    if note.destroy
      redirect_to root_path
    end
  end
end
