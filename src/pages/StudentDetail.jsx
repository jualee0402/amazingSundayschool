import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function StudentDetail({ data, setData }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = (data.students || []).find(s => s.id === id)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    if (student) setFormData({ ...student })
  }, [student])

  if (!student) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate('/')} className="btn-ghost">← 뒤로</button>
        <div className="card p-10 text-center">
          <p className="text-slate-500">학생을 찾을 수 없습니다</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    setData({
      ...data,
      students: data.students.map(s => s.id === id ? { ...formData, id } : s)
    })
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirm('이 학생을 삭제하시겠습니까?')) {
      setData({ ...data, students: data.students.filter(s => s.id !== id) })
      navigate('/')
    }
  }

  // 달란트 요약
  const getStudentTalentSummary = () => {
    let total = 0
    const currentMonth = new Date().toISOString().substring(0, 7)
    let monthlyTotal = 0
    Object.entries(data.talents || {}).forEach(([key, activities]) => {
      const [date, studentId] = key.split('_')
      if (studentId !== id) return
      let dayTotal = 0
      Object.entries(activities).forEach(([act, val]) => {
        if (act === 'custom') dayTotal += Object.values(val).reduce((a, b) => a + b, 0)
        else if (typeof val === 'number') dayTotal += val
      })
      total += dayTotal
      if (date.startsWith(currentMonth)) monthlyTotal += dayTotal
    })
    return { total, monthlyTotal }
  }

  const talentSummary = getStudentTalentSummary()

  // 최근 활동
  const getRecentActivities = () => {
    const activities = []
    Object.entries(data.talents || {}).forEach(([key, acts]) => {
      const [date, studentId] = key.split('_')
      if (studentId !== id) return
      Object.entries(acts).forEach(([act, val]) => {
        if (act === 'custom') {
          Object.entries(val).forEach(([customId, points]) => {
            activities.push({ date, activity: '기타활동', points, id: customId })
          })
        } else {
          const actNames = { attendance: '출석', prayer: '대표기도', offering: '봉헌', praise: '찬양', dance: '율동', memory: '암송', bibleNote: '말씀노트', special: '특송', dawnPrayer: '새벽예배' }
          activities.push({ date, activity: actNames[act] || act, points: val, id: date + act })
        }
      })
    })
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20)
  }

  const recentActivities = getRecentActivities()

  return (
    <div className="space-y-5">
      {/* 상단 액션 바 */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="btn-ghost btn-sm -ml-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className="w-4 h-4"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          뒤로
        </button>
        {!isEditing && (
          <div className="flex gap-1">
            <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm">수정</button>
            <button onClick={handleDelete} className="btn-danger btn-sm">삭제</button>
          </div>
        )}
      </div>

      {isEditing ? (
        // 수정 모드
        <div className="card p-5 space-y-3">
          <h2 className="font-bold text-lg mb-1">정보 수정</h2>
          <div>
            <label className="label">이름</label>
            <input className="input" type="text" value={formData.name || ''}
                   onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">학년</label>
              <input className="input" type="text" value={formData.grade || ''}
                     onChange={(e) => setFormData({...formData, grade: e.target.value})} />
            </div>
            <div>
              <label className="label">생일</label>
              <input className="input" type="date" value={formData.birthday || ''}
                     onChange={(e) => setFormData({...formData, birthday: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label">연락처</label>
            <input className="input" type="tel" value={formData.phone || ''}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label className="label">부모님 연락처</label>
            <input className="input" type="tel" value={formData.parentPhone || ''}
                   onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} />
          </div>
          <div>
            <label className="label">메모</label>
            <textarea className="textarea" rows="3" value={formData.notes || ''}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">취소</button>
            <button onClick={handleSave} className="btn-primary flex-1">저장</button>
          </div>
        </div>
      ) : (
        <>
          {/* 프로필 */}
          <div className="text-center py-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-ink-900 to-ink-800
                            text-white text-3xl font-bold grid place-items-center mb-3 shadow-card">
              {student.name.charAt(0)}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">{student.name}</h1>
            {student.grade && (
              <span className="inline-block mt-1.5 px-3 py-1 rounded-full bg-slate-100
                               text-slate-600 text-xs font-semibold">
                {student.grade}
              </span>
            )}
          </div>

          {/* 달란트 요약 - 두 카드 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">이번 달</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold tabular text-amber-600">{talentSummary.monthlyTotal}</span>
                <span className="text-xs text-slate-500">달란트</span>
              </div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-xs text-slate-500 font-medium">전체 누적</div>
              <div className="mt-1 flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold tabular text-ink-900">{talentSummary.total}</span>
                <span className="text-xs text-slate-500">달란트</span>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">기본 정보</h2>
            <div className="card divide-y divide-slate-100">
              <DetailRow label="생일" value={student.birthday ? `🎂 ${student.birthday}` : '미입력'} />
              <DetailRow label="연락처"
                value={student.phone
                  ? <a href={`tel:${student.phone}`} className="text-ink-900 font-semibold tabular hover:underline">📞 {student.phone}</a>
                  : '미입력'} />
              <DetailRow label="부모님 연락처"
                value={student.parentPhone
                  ? <a href={`tel:${student.parentPhone}`} className="text-ink-900 font-semibold tabular hover:underline">📞 {student.parentPhone}</a>
                  : '미입력'} />
              <DetailRow label="메모" value={student.notes || '없음'} multiline />
            </div>
          </section>

          {/* 최근 활동 */}
          <section>
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">최근 활동 내역</h2>
            {recentActivities.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-sm text-slate-500">활동 내역이 없어요</p>
              </div>
            ) : (
              <div className="card divide-y divide-slate-100">
                {recentActivities.map((act, index) => (
                  <div key={act.id || index} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] text-slate-400 tabular w-20 flex-shrink-0">{act.date}</span>
                      <span className="font-medium text-sm text-slate-700 truncate">{act.activity}</span>
                    </div>
                    <span className="font-bold text-sm text-amber-600 tabular flex-shrink-0">+{act.points}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}

function DetailRow({ label, value, multiline }) {
  return (
    <div className={`px-4 py-3 ${multiline ? '' : 'flex items-center justify-between gap-3'}`}>
      <div className="text-xs text-slate-500 font-medium">{label}</div>
      <div className={`text-sm text-slate-700 ${multiline ? 'mt-1' : ''}`}>{value}</div>
    </div>
  )
}

export default StudentDetail
