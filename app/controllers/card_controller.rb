class CardController < ApplicationController
  require "payjp"
  def new
    card = Card.where(user_id: current_user.id)
    redirect_to card_path(card.first.id) if card.exists?
  end

  def create
    Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]  # PayjpオブジェクトにAPIキー（秘密鍵）を設定
    if params['payjp_token'].blank?  # トークンを取得できなかった場合（通信が成功している以上、このエラーが生じる可能性は低い）
      redirect_to new_card_path  # カード登録ページに戻る（場合によってはアラートを表示）
    else
      customer = Payjp::Customer.create(card: params['payjp_token'])  # payjpに顧客情報を登録
      # binding.pry
      @card = Card.new(user_id: current_user.id, customer_id: customer.id, card_id: customer.default_card)  # アプリケーションサーバにカード情報を登録
      if @card.save
        redirect_to card_path(current_user.id)
      else
        redirect_to new_card_path
      end
    end
  end

  def destroy
    card = Card.where(user_id: current_user.id).first
    if card.blank?
    else
      Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]
      customer = Payjp::Customer.retrieve(card.customer_id)
      customer.delete
      card.delete
    end
    redirect_to new_card_path
  end

  def show
    card = Card.where(user_id: current_user.id).first  # カード１枚のみの場合と複数の場合を作成しておきたい（今は変）
    if card.blank?
      redirect_to new_card_path
    else
      Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]
      customer = Payjp::Customer.retrieve(card.customer_id)
      @card_info = customer.cards.retrieve(card.card_id)
      # binding.pry
    end
  end
end
