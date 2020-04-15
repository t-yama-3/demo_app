Rails.application.routes.draw do
  devise_for :users
  root to: 'notes#index'
  resources :notes, only: [:create, :edit, :update, :destroy]
end
