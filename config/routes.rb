Rails.application.routes.draw do
  get 'purchase/index'
  get 'purchase/done'
  # get 'card/new'
  # get 'card/show'
  devise_for :users
  root to: 'notes#index'
  resources :notes, only: [:create, :edit, :update, :destroy]
  resources :card, only: [:new, :show] do
    collection do
      post 'show', to: 'card#show'
      post 'pay', to: 'card#pay'
      post 'delete', to: 'card#delete'
    end
  end
  resources :purchase, only: [:index] do
    collection do
      get 'index', to: 'purchase#index'
      post 'pay', to: 'purchase#pay'
      get 'done', to: 'purchase#done'
    end
  end
end
