Rails.application.routes.draw do
  devise_for :users
  root to: 'notes#index'
  resources :notes, only: [:create, :edit, :update, :destroy]
  resources :items

  # 以下payjpのrouting
  resources :card, only: [:new, :create, :show, :destroy]
  resources :purchase, only: [:new, :create]
end
