from datetime import datetime
from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import JsonResponse
from django.forms.models import model_to_dict
from .models import Task
from .forms import TaskForm
from .utils import is_ajax


class TaskView(View):
    def get(self, request):
        tasks = list(Task.objects.values())
        if is_ajax(request):
            return JsonResponse({'tasks': tasks}, status=200)
        return render(request, 'task/tasks.html')

    def post(self, request):
        bound_form = TaskForm(request.POST)
        if bound_form.is_valid():
            if request.POST.get('task_id'):
                instance = bound_form.save(commit=False)
                instance.id = int(request.POST['task_id'])
                instance.date = datetime.now()
                print(model_to_dict(instance))
            new_or_upd_task = bound_form.save()
            return JsonResponse({'task': model_to_dict(new_or_upd_task)},
                                status=200)
        return redirect('tasks_list_url')


class TaskComplete(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.completed = not task.completed
        task.save()
        return JsonResponse({'task': model_to_dict(task)}, status=200)


class TaskDelete(View):
    def post(self, request, id):
        task = Task.objects.get(id=id)
        task.delete()
        return JsonResponse({'result': 'task deleted'}, status=200)
