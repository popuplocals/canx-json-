
    document.addEventListener('DOMContentLoaded', function(){
        const tabs = document.querySelectorAll('.category_list li');
        const contents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', function(){
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');

                contents.forEach(c => c.classList.remove('active'));
                document.getElementById(this.dataset.tab).classList.add('active');
            });
        });
    });
    