# Generated by Django 5.2 on 2025-05-06 20:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('declarations', '0002_rename_place_and_time_resitexamdetail_date_and_more'),
        ('exams', '0008_remove_grade_resit_used'),
    ]

    operations = [
        migrations.CreateModel(
            name='ResitExamContent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('exam_type', models.CharField(max_length=50)),
                ('num_questions', models.PositiveIntegerField()),
                ('calculator_allowed', models.BooleanField(default=False)),
                ('additional_notes', models.TextField(blank=True)),
                ('course', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='exams.course')),
            ],
        ),
        migrations.CreateModel(
            name='ResitExamSchedule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('place', models.CharField(max_length=100)),
                ('date', models.CharField(max_length=100)),
                ('course', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='exams.course')),
            ],
        ),
        migrations.DeleteModel(
            name='ResitExamDetail',
        ),
    ]
