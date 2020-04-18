Rails.application.routes.draw do
  devise_for :users
  root to: 'notes#index'
  resources :notes, only: [:create, :edit, :update, :destroy]
  resources :items
  resources :card, only: [:new, :create, :show, :destroy]

  resources :purchase, only: [:index] do
    collection do
      get 'index'
      post 'pay'
      get 'done'
    end
  end
end
