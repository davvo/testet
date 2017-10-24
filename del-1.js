(function () {
	
	const form = document.querySelector('form.report')

	const activities = []

	const addActivity = (project, activity, from, to, note) => {
		activities.push({ project, activity, from, to, note })
		renderResult()
	}

	const editActivity = (index, project, activity, from, to, note) => {
		activities[index] = { project, activity, from, to, note }
		renderResult()
	}

	const removeActivity = (index) => {
		activities.splice(index, 1)
		renderResult()
	}

	const populateForm = (index) => {
		const activity = activities[index]
		form.querySelector('input[name=index]').value = index
		form.querySelector('select[name=project]').value = activity.project
		form.querySelector('select[name=activity]').value = activity.activity
		form.querySelector('input[name=from]').value = activity.from
		form.querySelector('input[name=to]').value = activity.to
		form.querySelector('textarea[name=note]').value = activity.note
	}

	const resetForm = () => {
		form.querySelector('input[name=index]').value = ''
		form.querySelector('select[name=project]').value = ''
		form.querySelector('select[name=activity]').value = ''
		form.querySelector('input[name=from]').value = ''
		form.querySelector('input[name=to]').value = ''
		form.querySelector('textarea[name=note]').value = ''
	}

	const formatTime = (time) => {
		if (time < 10) {
			return '0' + time + ':00'
		}
		return time + ':00'
	}

	const renderResult = () => {		
		const rows = activities.map(activity => {
			return (`
				<tr>
					<td>${activity.project}</td>
					<td>${activity.activity}</td>
					<td>${formatTime(activity.from)}</td>
					<td>${formatTime(activity.to)}</td>
					<td>${activity.note}</td>
					<td class="action-edit hide-text">Redigera<i></i></td>
					<td class="action-delete hide-text">Ta bort<i></i></td>
				</tr>
			`)
		})

		const tbody = document.querySelector('tbody')
		tbody.innerHTML = rows.join('')

		// handle edit row
		tbody.querySelectorAll('.action-edit > i').forEach((el, index) => {
			el.addEventListener('click', () => {
				populateForm(index)
			})
		})

		// handle delete row
		tbody.querySelectorAll('.action-delete > i').forEach((el, index) => {
			el.addEventListener('click', () => {
				if (confirm('Vill du ta bort aktivitet?')) {
					removeActivity(index)
				}
			})
		})

		const total = activities.reduce((tot, activity) => {
			return tot + (activity.to - activity.from)
		}, 0)

		document.querySelector('.total').innerHTML = total

	}

	form.addEventListener('submit', (e) => {
		e.preventDefault()

		const project = form.querySelector('select[name=project]').value

		if (project === '') {
			return alert('Du måste välja projekt.')
		}

		const activity = form.querySelector('select[name=activity]').value

		if (activity === '') {
			return alert('Du måste välja aktivitet.')
		}

		const from = parseInt(form.querySelector('input[name=from]').value, 10)

		if (Number.isNaN(from) || from < 0 || from > 24) {
			return alert('Ogiltig starttid.')
		}

		const to = parseInt(form.querySelector('input[name=to]').value, 10)

		if (Number.isNaN(to) || to < 0 || to > 24) {
			return alert('Ogiltig stopptid.')
		}

		if (from >= to) {
			return alert('Aktiviteten kan inte sluta innan den börjat.')
		}

		const note = form.querySelector('textarea[name=note]').value

		const index = parseInt(form.querySelector('input[name=index]').value, 10)

		if (index >= 0) {
			editActivity(index, project, activity, from, to, note)
		} else {
			addActivity(project, activity, from, to, note)			
		}

		resetForm()

	})

})()