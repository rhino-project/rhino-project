require_relative '20191105134216_create_filestack_pictures.rb'

class RevertFilestackPictures < ActiveRecord::Migration[6.0]
  def change
    revert CreateFilestackPictures
  end
end
