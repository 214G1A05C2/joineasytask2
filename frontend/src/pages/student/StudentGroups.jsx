import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Card, CardHeader, CardBody } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Users2,
  Crown,
  Plus,
  LogOut,
  UserPlus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export const StudentGroups = () => {
  const { user } = useAuth();
  const {
    courses,
    groups,
    users,
    createGroup,
    joinGroup,
    leaveGroup,
  } = useData();

  const [searchParams, setSearchParams] = useSearchParams();

  const enrolledCourses = courses.filter((c) => c.studentIds?.includes(user?.id));
  const initialCourseId = searchParams.get('course') || enrolledCourses[0]?.id || '';

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [nameError, setNameError] = useState('');
  const [leavingGroup, setLeavingGroup] = useState(null);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const courseGroups = groups.filter((g) => g.courseId === selectedCourseId);

  // Student's current group in this course
  const currentGroup = courseGroups.find((g) => g.memberIds.includes(user?.id));
  const isLeader = currentGroup && currentGroup.leaderId === user?.id;

  // Other available groups in this course
  const availableGroups = courseGroups.filter((g) => !g.memberIds.includes(user?.id));

  const handleOpenCreate = () => {
    setNewGroupName('');
    setNameError('');
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) {
      setNameError('Group name is required');
      return;
    }
    if (newGroupName.trim().length < 3) {
      setNameError('Group name must be at least 3 characters');
      return;
    }

    try {
      createGroup({
        name: newGroupName.trim(),
        courseId: selectedCourseId,
        leaderId: user.id,
      });
      setIsCreateOpen(false);
    } catch (err) {
      setNameError(err.message);
    }
  };

  const handleJoin = (group) => {
    joinGroup({
      groupId: group.id,
      studentId: user.id,
    });
  };

  const handleConfirmLeave = () => {
    if (leavingGroup) {
      leaveGroup({
        groupId: leavingGroup.id,
        studentId: user.id,
      });
      setLeavingGroup(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Group Management
          </h1>
          <p className="text-sm text-slate-500">
            Form collaborative teams for group deliverables, manage memberships, and assign leaders
          </p>
        </div>

        {/* Course Selector */}
        <div className="w-full sm:w-72">
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              const newParams = new URLSearchParams(searchParams);
              newParams.set('course', e.target.value);
              setSearchParams(newParams);
            }}
            className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-xs"
          >
            {enrolledCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} – {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CURRENT GROUP SECTION */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          Your Active Team in {selectedCourse?.code}
        </h2>

        {currentGroup ? (
          <Card className="border-indigo-200 ring-1 ring-indigo-500/10 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-indigo-50/40 via-white to-purple-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800">
                      {selectedCourse?.code}
                    </span>
                    <Badge variant={isLeader ? 'purple' : 'info'} size="sm">
                      {isLeader ? 'You are Group Leader' : 'Team Member'}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {currentGroup.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Formed on {new Date(currentGroup.createdAt).toLocaleDateString()} • Capacity:{' '}
                    {currentGroup.memberIds.length} / {currentGroup.maxSize || 4} members
                  </p>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setLeavingGroup(currentGroup)}
                  icon={LogOut}
                >
                  Leave Group
                </Button>
              </div>

              {/* Members List */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Group Members ({currentGroup.memberIds.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentGroup.memberIds.map((mId) => {
                    const memberUser = users.find((u) => u.id === mId);
                    const isMemLeader = currentGroup.leaderId === mId;
                    const isSelf = memberUser?.id === user?.id;

                    return (
                      <div
                        key={mId}
                        className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                          isMemLeader
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-white border-slate-200/80'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={
                              memberUser?.avatar ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                            }
                            alt={memberUser?.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                          />
                          {isMemLeader && (
                            <span
                              className="absolute -top-1 -right-1 p-0.5 rounded-full bg-amber-500 text-white shadow-xs"
                              title="Group Leader"
                            >
                              <Crown className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {memberUser?.name}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block truncate">
                            {memberUser?.rollNumber || memberUser?.email}
                          </span>
                          {isMemLeader && (
                            <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5 mt-0.5">
                              <Crown className="w-3 h-3" /> Leader
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                You have not joined a group in {selectedCourse?.name} yet
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Join an existing team below or create your own group to submit collaborative deliverables.
              </p>
            </div>
            <Button onClick={handleOpenCreate} icon={Plus}>
              Create New Group
            </Button>
          </div>
        )}
      </div>

      {/* AVAILABLE GROUPS TO JOIN */}
      <div className="space-y-4 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Other Groups in {selectedCourse?.code}
            </h2>
            <p className="text-xs text-slate-500">
              {currentGroup
                ? 'You must leave your current group before joining another group.'
                : 'Choose an open team to join.'}
            </p>
          </div>

          {!currentGroup && (
            <Button onClick={handleOpenCreate} size="sm" icon={Plus}>
              Create Group
            </Button>
          )}
        </div>

        {availableGroups.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-100">
            No other groups created for this course yet. Be the first to start a team!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableGroups.map((grp) => {
              const leader = users.find((u) => u.id === grp.leaderId);
              const isFull = grp.memberIds.length >= (grp.maxSize || 4);

              return (
                <Card key={grp.id} className="p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base font-bold text-slate-900">{grp.name}</h3>
                      <Badge variant={isFull ? 'danger' : 'success'} size="sm">
                        {isFull ? 'Full' : 'Open'}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 mb-6 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Team Leader:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          {leader?.name || grp.leaderName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Members:</span>
                        <span className="font-bold text-slate-800">
                          {grp.memberIds.length} / {grp.maxSize || 4}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleJoin(grp)}
                    disabled={isFull || !!currentGroup}
                    variant={isFull ? 'secondary' : 'primary'}
                    className="w-full"
                    icon={UserPlus}
                  >
                    {isFull
                      ? 'Group Full'
                      : currentGroup
                      ? 'Already in a Group'
                      : 'Join Group'}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Team"
        subtitle={`You will be assigned as Group Leader for ${selectedCourse?.name}`}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Group Name *
            </label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => {
                setNewGroupName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder="e.g. CyberKnights or Alpha Devs"
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                nameError ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            />
            {nameError && <p className="mt-1 text-xs text-rose-600">{nameError}</p>}
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-600" /> Leader Privilege:
            </p>
            <p className="text-slate-600 leading-relaxed">
              As creator, you will be the group leader responsible for submitting and acknowledging group assignments on OneDrive.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Team</Button>
          </div>
        </form>
      </Modal>

      {/* LEAVE GROUP CONFIRMATION */}
      <ConfirmDialog
        isOpen={!!leavingGroup}
        onClose={() => setLeavingGroup(null)}
        onConfirm={handleConfirmLeave}
        title="Leave Group"
        message={
          isLeader
            ? `You are currently the leader of "${leavingGroup?.name}". If you leave, leadership will be passed to another member or the group will be dissolved if you are the only member.`
            : `Are you sure you want to leave "${leavingGroup?.name}"? You will need to join or create another group to submit group deliverables.`
        }
        confirmText="Yes, Leave Group"
        cancelText="Stay in Group"
        type="warning"
      />
    </div>
  );
};
