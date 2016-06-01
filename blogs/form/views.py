from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from .forms import PostForm,DeleteForm
from .models import Post
from django.shortcuts import redirect

def post_list(request):
    posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('published_date')
    return render(request, 'form/post_list.html', {'posts': posts})

def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
       
    
## delete post
    form_to_delete = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = DeleteForm(request.POST, instance=form_to_delete)
        if form.is_valid():
            form_to_delete.delete()
          
            return redirect('form:post_list')    
        else:
            form = DeleteForm(instance=form_to_delete)
    
    return render(request,'form/post_detail.html',{'post':post})
    return render(request, 'form/post_detail.html', {'post': post})


    

def post_new(request):
    if request.method == "POST":
        form = PostForm(request.POST)
    

    
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('form:post_detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, 'form/new_post.html', {'form': form})


def post_edit(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.published_date = timezone.now()
            post.save()
            return redirect('form:post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'form/post_edit.html', {'form': form ,'post': post})


##def post_delete(request,pk):
    
    

# Create your views here.
