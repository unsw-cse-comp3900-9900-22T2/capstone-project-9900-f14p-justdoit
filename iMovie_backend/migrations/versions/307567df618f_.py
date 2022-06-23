"""empty message

Revision ID: 307567df618f
Revises: 2626dfb05757
Create Date: 2022-06-23 21:51:21.280481

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '307567df618f'
down_revision = '2626dfb05757'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('coverimage', table_name='movies')
    op.drop_index('moviename', table_name='movies')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('moviename', 'movies', ['moviename'], unique=True)
    op.create_index('coverimage', 'movies', ['coverimage'], unique=True)
    # ### end Alembic commands ###
