class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :notes
  has_many :cards  # カード複数枚を前提とする（未実装であるが）
end
