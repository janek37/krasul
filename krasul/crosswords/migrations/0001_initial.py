# Generated by Django 2.2.3 on 2019-12-22 23:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Crossword',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('width', models.IntegerField()),
                ('height', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clue', models.TextField()),
                ('crossword', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entries', to='crosswords.Crossword')),
            ],
        ),
        migrations.CreateModel(
            name='Square',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('solution', models.CharField(blank=True, max_length=4)),
                ('crossword', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='squares', to='crosswords.Crossword')),
            ],
            options={
                'ordering': ['y', 'x'],
            },
        ),
        migrations.CreateModel(
            name='EntrySquare',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
                ('entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='crosswords.Entry')),
                ('square', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='crosswords.Square')),
            ],
        ),
        migrations.AddField(
            model_name='entry',
            name='squares',
            field=models.ManyToManyField(through='crosswords.EntrySquare', to='crosswords.Square'),
        ),
    ]
