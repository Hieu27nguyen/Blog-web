$(document).ready(function () {
    // Create Project
    $('#createProjectForm').on('submit', function (e) {
        e.preventDefault();
        const projectData = {
            name: $('#name').val(),
            description: $('#description').val(),
            status: $('#status').val()
        };

        $.ajax({
            url: 'http://localhost:3000/project',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(projectData),
            success: function (response) {
                $('#createSuccess').show().delay(3000).fadeOut();
                $('#createProjectForm')[0].reset();
            },
            error: function (error) {
                console.error('Error creating project:', error);
            }
        });
    });

    // Fetch and display projects on read.html
    function fetchProjects() {
        $.ajax({
            url: 'http://localhost:3000/',
            type: 'GET',
            success: function (data) {
                let projectList = $('#project-list');
                projectList.empty();
                data.forEach(project => {
                    projectList.append(`
                        <tr>
                            <td>${project.name}</td>
                            <td>${project.description}</td>
                            <td>${project.status}</td>
                            <td>
                                <button class="btn btn-info view-btn" data-name="${project.name}">View</button>
                                <button class="btn btn-primary edit-btn" data-name="${project.name}">Edit</button>
                                <button class="btn btn-danger delete-btn" data-name="${project.name}">Delete</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function (error) {
                console.error('Error fetching projects:', error);
            }
        });
    }

    // Initialize project list
    if (window.location.pathname.includes('read.html')) {
        fetchProjects();
    }

    // View Project
    $(document).on('click', '.view-btn', function () {
        const projectName = $(this).data('name');
        window.location.href = `view.html?name=${projectName}`;
    });

    // Edit Project
    $(document).on('click', '.edit-btn', function () {
        const projectName = $(this).data('name');
        window.location.href = `update.html?name=${projectName}`;
    });

    // Delete Project
    $(document).on('click', '.delete-btn', function () {
        const projectName = $(this).data('name');
        $.ajax({
            url: `http://localhost:3000/project/${projectName}`,
            type: 'DELETE',
            success: function (response) {
                fetchProjects();
                alert('Project deleted successfully!');
            },
            error: function (error) {
                console.error('Error deleting project:', error);
            }
        });
    });

    // Populate form on update.html
    if (window.location.pathname.includes('update.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectName = urlParams.get('name');

        $.ajax({
            url: `http://localhost:3000/project/${projectName}`,
            type: 'GET',
            success: function (project) {
                $('#name').val(project.name).prop('disabled', true);
                $('#description').val(project.description);
                $('#status').val(project.status);
            },
            error: function (error) {
                console.error('Error fetching project:', error);
            }
        });

        $('#updateProjectForm').on('submit', function (e) {
            e.preventDefault();
            const projectData = {
                description: $('#description').val(),
                status: $('#status').val()
            };

            $.ajax({
                url: `http://localhost:3000/project/${projectName}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(projectData),
                success: function (response) {
                    $('#updateSuccess').show().delay(3000).fadeOut();
                },
                error: function (error) {
                    console.error('Error updating project:', error);
                }
            });
        });
    }

    // View project details on view.html
    if (window.location.pathname.includes('view.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const projectName = urlParams.get('name');

        $.ajax({
            url: `http://localhost:3000/project/${projectName}`,
            type: 'GET',
            success: function (project) {
                $('#projectDetails').html(`
                    <tr><th>Name</th><td>${project.name}</td></tr>
                    <tr><th>Description</th><td>${project.description}</td></tr>
                    <tr><th>Status</th><td>${project.status}</td></tr>
                    <tr><th>Start Date</th><td>${new Date(project.startDate).toLocaleDateString()}</td></tr>
                    <tr><th>End Date</th><td>${project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</td></tr>
                `);
            },
            error: function (error) {
                console.error('Error fetching project details:', error);
            }
        });
    }

    // Delete project form on delete.html
    if (window.location.pathname.includes('delete.html')) {
        $('#deleteProjectForm').on('submit', function (e) {
            e.preventDefault();
            const projectName = $('#projectName').val();
            $.ajax({
                url: `http://localhost:3000/project/${projectName}`,
                type: 'DELETE',
                success: function (response) {
                    $('#deleteSuccess').show().delay(3000).fadeOut();
                    fetchProjects();
                },
                error: function (error) {
                    console.error('Error deleting project:', error);
                }
            });
        });
    }
});
