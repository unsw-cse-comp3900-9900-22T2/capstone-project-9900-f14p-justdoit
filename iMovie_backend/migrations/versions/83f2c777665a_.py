"""empty message

Revision ID: 83f2c777665a
Revises: 
Create Date: 2022-06-15 14:09:36.266599

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '83f2c777665a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('genre',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('gid', sa.String(length=256), nullable=False),
    sa.Column('genrename', sa.String(length=256), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('genrename'),
    sa.UniqueConstraint('gid')
    )
    op.create_table('movielike',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mlid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('mid', sa.String(length=256), nullable=False),
    sa.Column('type', sa.Integer(), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('mlid')
    )
    op.create_table('movielist',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('molid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('mid', sa.String(length=256), nullable=False),
    sa.Column('title', sa.String(length=256), nullable=False),
    sa.Column('description', sa.TEXT(), nullable=True),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('molid')
    )
    op.create_table('moviereview',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mrid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('mid', sa.String(length=256), nullable=False),
    sa.Column('review', sa.TEXT(), nullable=True),
    sa.Column('rate', sa.FLOAT(), nullable=True),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('mrid')
    )
    op.create_table('movies',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mid', sa.String(length=256), nullable=False),
    sa.Column('moviename', sa.String(length=256), nullable=False),
    sa.Column('coverimage', sa.String(length=256), nullable=True),
    sa.Column('description', sa.TEXT(), nullable=False),
    sa.Column('genre', sa.String(length=120), nullable=True),
    sa.Column('cast', sa.String(length=256), nullable=True),
    sa.Column('crew', sa.String(length=256), nullable=True),
    sa.Column('director', sa.String(length=256), nullable=True),
    sa.Column('country', sa.String(length=120), nullable=True),
    sa.Column('language', sa.String(length=120), nullable=True),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('avg_rate', sa.FLOAT(), nullable=True),
    sa.Column('release_date', sa.DateTime(), nullable=True),
    sa.Column('Off_data', sa.DateTime(), nullable=True),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('coverimage'),
    sa.UniqueConstraint('mid'),
    sa.UniqueConstraint('moviename')
    )
    op.create_table('userreview',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('urid', sa.String(length=256), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('mrid', sa.String(length=256), nullable=False),
    sa.Column('review', sa.TEXT(), nullable=True),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('urid')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('username', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=256), nullable=False),
    sa.Column('email', sa.String(length=256), nullable=False),
    sa.Column('role', sa.Integer(), nullable=False),
    sa.Column('verifycode', sa.Integer(), nullable=True),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('uid'),
    sa.UniqueConstraint('username')
    )
    op.create_table('wish',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('wid', sa.String(length=256), nullable=False),
    sa.Column('type', sa.Integer(), nullable=False),
    sa.Column('uid', sa.String(length=256), nullable=False),
    sa.Column('mid', sa.String(length=256), nullable=False),
    sa.Column('active', sa.Integer(), nullable=False),
    sa.Column('ctime', sa.DateTime(), nullable=False),
    sa.Column('utime', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('wid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('wish')
    op.drop_table('users')
    op.drop_table('userreview')
    op.drop_table('movies')
    op.drop_table('moviereview')
    op.drop_table('movielist')
    op.drop_table('movielike')
    op.drop_table('genre')
    # ### end Alembic commands ###
